from app.services.documentation_service import download_and_save_repository, embed_repository_to_vector_db
from fastapi import HTTPException


async def get_documentation_controller(repo_name: str):
    try:
        result = await download_and_save_repository(repo_name)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching and saving documentation for repository {repo_name}: {e}",
        )
    
async def embed_repository_controller(repo_name: str):
    try:
        result = await embed_repository_to_vector_db(repo_name)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error Embedding repository {repo_name}: {e}",
        )
