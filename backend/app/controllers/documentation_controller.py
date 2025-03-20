from app.services.documentation_service import fetch_and_save_repository
from fastapi import HTTPException

async def get_documentation_controller(repo_name: str):
    try: 
        result = await fetch_and_save_repository(repo_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching and saving documentation for repository {repo_name}: {e}")
