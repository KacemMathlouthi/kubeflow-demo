from fastapi import HTTPException

from app.services.weaviate_service import (
    create_documentation_collection,
    check_collection_exists,
    add_documentation_item,
    retrieve_documentation_items,
    delete_documentation_item,
    similarity_search,
    get_docs_count,
)


async def check_documentations_exists_controller():
    """
    Controller function to check if the documentations collection exists.
    """
    try:
        return await check_collection_exists()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error checking collection existence: {e}"
        )


async def create_documentations_collection_controller():
    """
    Controller function to create the documentations collection.
    """
    try:
        return await create_documentation_collection()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating collection: {e}")


async def add_documentation_item_controller(documentSource, documentURL, documentContent):
    """
    Controller function to add a documentation item to the collection.
    """
    try:
        result = add_documentation_item(documentSource, documentURL, documentContent)
        if result:
            return result
        else:
            raise HTTPException(
                status_code=500, detail="Failed to add documentations item."
            )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error adding documentations item: {e}"
        )


async def retrieve_documentation_items_controller(documentSource=None, documentURL=None):
    """
    Controller function to retrieve documentations items from the collection.
    """
    try:
        return retrieve_documentation_items(documentSource, documentURL)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving documentations items: {e}"
        )


async def delete_documentation_item_controller(uuid: str):
    """
    Controller function to delete a documentation item from the collection.
    """
    try:
        delete_documentation_item(uuid)
        return {
            "message": f"documentations item with UUID {uuid} deleted successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting documentations item: {e}"
        )


async def similarity_search_controller(prompt, top_k=5):
    """
    Controller to perform a similarity search on the documentations collection.
    """
    try:
        return await similarity_search(prompt, top_k)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error performing similarity search: {e}",
        )

async def get_docs_count_controller():
    """
    Controller to get the total number of documents in the collection.
    """
    try:
        return await get_docs_count()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting document count: {e}",
        )