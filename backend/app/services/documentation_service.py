import os
import requests
from bs4 import BeautifulSoup

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
    Downloads the repository ZIP file from Gitingest and saves it locally.

    Args:
        repository_name (str): The name of the repository (e.g., "kubeflow-website").
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
        return True
    else:
        print(f"Failed to download the repository. HTTP Status: {response.status_code}")
        return False
