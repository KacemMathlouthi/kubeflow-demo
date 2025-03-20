import os
import requests
from bs4 import BeautifulSoup

async def fetch_and_save_repository(repository_name: str):
    """
    Gitingest is used to fetch the content of a GitHub repository.
    This function is used to fetch the content of a specific repository.
    The content is then saved to a file.

    Args:
        repository_name (str): The name of the repository to fetch.

    PS: I saw how Gitingest send the request through Network tab in Chrome DevTools 
        and I mimic it but it won't be like this in a prod version, this is a temporary solution.
    """
    url = "https://gitingest.com/"

    # Define the payload
    payload = {
        "input_text": repository_name,
        "max_file_size": 243,
        "pattern_type": "exclude",
        "pattern": ""
    }

    # Send the request
    response = requests.post(url, data=payload)

    # Ensure request was successful
    if response.status_code != 200:
        print(f"Failed to fetch data. HTTP Status: {response.status_code}")
        return
    
    # Parse HTML response
    soup = BeautifulSoup(response.text, "html.parser")
    
    # Find the textarea with the extracted content
    textarea = soup.find("textarea", class_="result-text")
    if not textarea:
        print("Failed to find repository content in the response.")
        return

    # Extract only the text from the textarea
    extracted_text = textarea.text.strip()

    # Define the output directory and file
    save_dir = os.path.join(os.getcwd(), "parsed_repositories", repository_name)
    os.makedirs(save_dir, exist_ok=True)
    save_path = os.path.join(save_dir, "content.txt")

    # Save the extracted content
    with open(save_path, "w", encoding="utf-8") as file:
        file.write(extracted_text)

    print(f"Repository content successfully saved to: {save_path}")
    return extracted_text
