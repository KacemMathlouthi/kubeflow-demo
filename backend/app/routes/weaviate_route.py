from fastapi import APIRouter, HTTPException

from app.controllers.weaviate_controller import (
    add_documentation_item_controller,
    check_documentations_exists_controller,
    create_documentations_collection_controller,
    delete_documentation_item_controller,
    retrieve_documentation_items_controller,
    similarity_search_controller,
    get_docs_count_controller,
)

from app.core.db import get_weaviate_client

router = APIRouter()


@router.get("/vectordb/healthcheck")
def healthcheck():
    """
    Test route to check Weaviate connection.
    """
    client = get_weaviate_client()
    if client.is_ready():
        return {"message": "Weaviate connection successful!"}
    else:
        return {"message": "Weaviate connection failed!"}


@router.post("/vectordb/checkcollection")
async def check_collection():
    """
    Endpoint to check if the documentations collection exists.
    """
    try:
        return await check_documentations_exists_controller()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error Checking Collection Existance: {e}"
        )


@router.post("/vectordb/collection")
async def create_collection():
    """
    Endpoint to create the documentations collection if it doesn't exist.
    """
    try:
        result = await create_documentations_collection_controller()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating collection: {e}")


@router.post("/vectordb")
async def add_documentation(documentSource: str, documentURL: str, documentContent: str):
    """
    Endpoint to add a new documentations item to the collection.
    """
    try:
        return await add_documentation_item_controller(
            documentSource, documentURL, documentContent
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding  item: {e}")


@router.get("/vectordb")
async def get_documentations(documentSource=None, documentURL=None):
    """
    Endpoint to retrieve documentations items with optional filters for documentSource, documentURL.
    """
    try:
        items = await retrieve_documentation_items_controller(
            documentSource, documentURL
        )
        return items
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving documentations items: {e}"
        )


@router.delete("/vectordb/{uuid}")
async def delete_documentation(uuid: str):
    """
    Endpoint to delete a documentations item by its UUID.
    """
    try:
        await delete_documentation_item_controller(uuid)
        return {
            "message": f"documentations item with UUID '{uuid}' deleted successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting documentations item: {e}"
        )


@router.get("/vectordb/similarity")
async def Get_similar_documentations(prompt: str, top_k: int = 5):
    """
    Endpoint to perform a similarity search for documentations items based on a given prompt and returning the top_k results.
    """
    try:
        items = await similarity_search_controller(prompt, top_k)
        return items
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error performing similarity search: {e}"
        )


@router.get("/vectordb/count")
async def get_docs_count():
    """
    Endpoint to get the total number of documents in the collection.
    """
    try:
        count = await get_docs_count_controller()
        return {"count": count}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting document count: {e}",
        )   