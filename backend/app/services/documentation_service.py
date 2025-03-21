import os
import requests
from bs4 import BeautifulSoup
from typing import List, Tuple, Dict
import re
from langchain.text_splitter import TokenTextSplitter

BASE_URL = "https://gitingest.com"  # Base URL for constructing the full download link


async def fetch_download_link(repository_name: str):
    """
    Gitingest is used to fetch the content of a GitHub repository.
    This function is used to fetch the download link for the content of a given repository.

    Args:
        repository_name (str): The name of the repository to fetch. Example: kubeflow/website

    Returns:
        str: The download link for the content of the given repository.
        requests.Session: A session object to maintain cookies and headers.

    PS: I saw how Gitingest send the request through Network tab in Chrome DevTools
        and I mimic it but it won't be like this in a prod version, this is a temporary solution.
    """
    # Define the payload
    payload = {
        "input_text": repository_name,
        "max_file_size": 243,
        "pattern_type": "exclude",
        "pattern": "",
    }

    # Create a session to maintain cookies and headers
    session = requests.Session()

    # Send the request using the session
    response = session.post(BASE_URL, data=payload)

    # Ensure request was successful
    if response.status_code != 200:
        print(f"Failed to fetch data. HTTP Status: {response.status_code}")
        return None

    # Parse HTML response
    soup = BeautifulSoup(response.text, "html.parser")

    # Find the download link
    download_link_tag = soup.find("a", href=lambda href: href and "download" in href)

    if not download_link_tag:
        print("Failed to find the download link in the response.")
        return None

    # Extract the download link
    download_link = BASE_URL + download_link_tag["href"]

    print(f"Download link found: {download_link}")
    return download_link, session


async def download_and_save_repository(repository_name: str):
    """
    Downloads the repository text file from Gitingest and saves it locally.

    Args:
        repository_name (str): The name of the repository (for example "kubeflow-website").
    """
    # Get the download link
    download_url, session = await fetch_download_link(repository_name)

    if not download_url or not session:
        print("Failed to obtain download URL or session. Cannot proceed with download.")
        return False

    # Define the output directory and file path
    save_dir = os.path.join(os.getcwd(), "parsed_repositories", repository_name)
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, "code.txt")

    # Send a request to download the file
    response = session.get(download_url, stream=True)

    if response.status_code == 200:
        with open(save_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=1024):
                file.write(chunk)

        print(f"Repository successfully downloaded and saved to: {save_path}")
        return save_path
    else:
        print(f"Failed to download the repository. HTTP Status: {response.status_code}")
        return "Failed to download the repository."


async def parse_repository_file(repository_name: str) -> List[Tuple[str, str]]:
    """
    Parse the downloaded repository content file and extract individual file contents.
    
    Args:
        repository_name (str): The name of the repository (for example "kubeflow/website").

    Returns:
        List[Tuple[str, str]]: List of tuples containing (filename, content).
    """
    file_path = await download_and_save_repository(repository_name)

    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as file:
            content = file.read()
        
        # Separator pattern for the file separators
        # ================================================
        # File: (filename)
        # ================================================
        separator_pattern = r'={48,}\s*File:\s*(.*?)\s*={48,}'
        
        # Find all matches
        matches = list(re.finditer(separator_pattern, content, re.DOTALL))
        
        if not matches:
            print("No file separators found with the expected pattern.")
            return []
        
        print(f"Found {len(matches)} file separators in the content.")
        
        # Extract filenames and positions
        filenames = [match.group(1).strip() for match in matches]
        start_positions = [match.start() for match in matches]
        
        file_contents = []
        for i in range(len(start_positions)):
            # Get current filename
            filename = filenames[i]
            
            # Determine the content start position (end of current separator)
            match_text = matches[i].group(0)
            content_start = start_positions[i] + len(match_text)
            
            # Determine the content end position (start of next separator or end of file)
            if i < len(start_positions) - 1:
                content_end = start_positions[i + 1]
            else:
                content_end = len(content)
            
            # Extract the file content
            file_content = content[content_start:content_end].strip()
            
            # Add the file info to the list
            file_contents.append((filename, file_content))
        
        return file_contents
    
    except Exception as e:
        print(f"Error parsing repository file: {e}")
        return []


async def preprocess_repository_file(repository_name: str) -> List[Tuple[str, str]]:
    """
    Preprocess the file content by removing unnecessary files (under 50 character for example)

    Args:
        repository_name (str): The name of the repository (for example "kubeflow/website").
    """
    file_contents = parse_repository_file(repository_name)
    
    # Preprocess the file content
    preprocessed_file_contents = []
    for filename, content in file_contents:
        if len(content) > 50:
            preprocessed_file_contents.append((filename, content))
    return preprocessed_file_contents


async def chunk_repository_contents(repository_name: str, chunk_size: int = 1000, chunk_overlap: int = 100) -> List[Dict[str, str]]:
    """
    Chunks the preprocessed repository file contents using TokenTextSplitter.
    
    Args:
        repository_name (str): The name of the repository (for example "kubeflow/website").
        chunk_size (int, optional): The size of each chunk in tokens. Defaults to 1000.
        chunk_overlap (int, optional): The number of overlapping tokens between chunks. Defaults to 100.
        
    Returns:
        List[Dict[str, str]]: A list of dictionaries containing the chunked content with metadata.
    """
    # Get preprocessed file contents
    file_contents = await preprocess_repository_file(repository_name)
    
    # Initialize the TokenTextSplitter
    text_splitter = TokenTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    
    chunked_contents = []
    
    for filename, content in file_contents:
        # Split the content into chunks
        chunks = text_splitter.split_text(content)
        
        # Create a document for each chunk with metadata
        for i, chunk in enumerate(chunks):
            chunked_contents.append({
                "documentSource" : "Github Repository:" + repository_name,
                "documentURL" : "https://github.com/" + repository_name,
                "documentContent": chunk,
            })
    
    print(f"Created {len(chunked_contents)} chunks from {len(file_contents)} files")
    return chunked_contents
