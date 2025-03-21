from datetime import datetime, timezone
from weaviate.classes.config import Configure, DataType, Property, VectorDistances
from weaviate.classes.query import Filter, MetadataQuery
from app.core.db import get_weaviate_client
from app.services.embedding_service import get_embeddings

# Initialize the Weaviate client globally
client = get_weaviate_client()

DOCUMENTATION_CLASS_NAME = "KubeflowDocumentation"

async def check_collection_exists(class_name=DOCUMENTATION_CLASS_NAME):
    """
    Check if a collection (class) exists in Weaviate.
    """
    try:
        return client.collections.exists(class_name)
    except Exception as e:
        print(f"Error checking collection existence: {e}")
        return False

async def create_documentation_collection(class_name=DOCUMENTATION_CLASS_NAME):
    """
    Create a collection (class) in Weaviate for storing Kubeflow Documentation, if it doesn't exist.
    """
    try:
        exists = await check_collection_exists(class_name)
        if not exists:
            client.collections.create(
                name=class_name,
                vectorizer_config=Configure.Vectorizer.none(),
                properties=[
                    Property(name="documentSource", data_type=DataType.TEXT), # Source of the document (GitHub, Article, whatever...)
                    Property(name="documentURL", data_type=DataType.TEXT), # URL of the document (for citations later)
                    Property(name="documentContent", data_type=DataType.TEXT), # The Chunk to be stored
                    Property(name="created_at", data_type=DataType.DATE), # Timestamp (maybe useful later in case there is update to the documentation)
                ],
                vector_index_config=Configure.VectorIndex.hnsw(
                    distance_metric=VectorDistances.COSINE,
                ),
            )
            return {"message": f"Collection {class_name} created successfully"}
        else:
            return {"message": f"Collection {class_name} already exists"}
    except Exception as e:
        raise Exception(f"Error in creating documentation collection: {e}")


def add_documentation_item(documentSource, documentURL, documentContent):
    """
    Add a documentation item to the Weaviate collection.
    """
    try:
        documentation_collection = client.collections.get(DOCUMENTATION_CLASS_NAME)

        # Generate embedding vector
        vector = get_embeddings(documentContent)

        # Current timestamp
        timestamp = datetime.now(timezone.utc)

        documentation_item = {
            "documentSource": documentSource,
            "documentURL": documentURL,
            "documentContent": documentContent,
            "created_at": timestamp,
        }

        # Insert the item and get its UUID
        result = documentation_collection.data.insert(
            properties=documentation_item, vector=vector
        )
        return {result : documentation_item}
    
    except Exception as e:
        print(f"Error adding documentation item: {e}")
        return None


def retrieve_documentation_items(documentSource=None, documentURL=None):
    """
    Retrieve documentation items from the collection, with optional filters.
    """
    try:
        documentation_collection = client.collections.get(DOCUMENTATION_CLASS_NAME)

        # Build filters dynamically
        filters = []
        if documentSource:
            filters.append(Filter.by_property("documentSource").equal(documentSource))
        if documentURL:
            filters.append(Filter.by_property("documentURL").equal(documentURL))

        # Combine filters
        if filters:
            combined_filter = Filter.all_of(filters)
            # Execute query
            result = documentation_collection.query.fetch_objects(
                filters=combined_filter, include_vector=True
            )
        else:
            result = documentation_collection.query.fetch_objects(include_vector=True)

        return result.objects

    except Exception as e:
        print(f"Error retrieving documentation items: {e}")
        return []


def delete_documentation_item(uuid):
    """
    Delete a documentation item by its UUID.
    """
    if not check_collection_exists():
        raise ValueError(f"Collection '{DOCUMENTATION_CLASS_NAME}' does not exist.")

    try:
        documentation_collection = client.collections.get(DOCUMENTATION_CLASS_NAME)
        documentation_collection.data.delete_by_id(uuid)
        print(f"documentation item with UUID '{uuid}' deleted successfully.")
    except Exception as e:
        raise ValueError(f"Failed to delete documentation item: {e}")


async def similarity_search(prompt, top_k=5):
    """
    Perform a similarity search on the documentations base.

    :param prompt: The text to search for similar items
    :param top_k: The maximum number of results to return
    :return: List of similar items
    """
    try:
        documentation_collection = client.collections.get(DOCUMENTATION_CLASS_NAME)

        query_vector = get_embeddings(prompt)

        response = documentation_collection.query.near_vector(
            near_vector=query_vector,
            limit=top_k,
            return_metadata=MetadataQuery(distance=True),
        )
        return response.objects

    except Exception as e:
        print(f"Error performing similarity search: {e}")
        return []
