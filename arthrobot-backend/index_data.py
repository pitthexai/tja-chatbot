from elasticsearch import Elasticsearch, NotFoundError
from langchain_elasticsearch import ElasticsearchStore
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

import json
import os
import time

# Global variables
INDEX = os.getenv("ES_INDEX", "iid-chatbot-hexai")
FILE = os.getenv("FILE", f"{os.path.dirname(__file__)}/../data")
ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL", "http://localhost:9200")
ELSER_MODEL = os.getenv("ELSER_MODEL", ".elser_model_2")

if ELASTICSEARCH_URL:
    elasticsearch_client = Elasticsearch(
        hosts=[ELASTICSEARCH_URL],
    )

def install_elser():
    try:
        elasticsearch_client.ml.get_trained_models(model_id=ELSER_MODEL)
        print(f'"{ELSER_MODEL}" model is available')
    except NotFoundError:
        print(f'"{ELSER_MODEL}" model not available, downloading it now')
        elasticsearch_client.ml.put_trained_model(
            model_id=ELSER_MODEL, input={"field_names": ["text_field"]}
        )
        while True:
            status = elasticsearch_client.ml.get_trained_models(
                model_id=ELSER_MODEL, include="definition_status"
            )
            if status["trained_model_configs"][0]["fully_defined"]:
                # model is ready
                break
            time.sleep(1)

        print("Model downloaded, starting deployment")
        elasticsearch_client.ml.start_trained_model_deployment(
            model_id=ELSER_MODEL, wait_for="fully_allocated"
        )


def main():
    install_elser()

    # Delete index if it exists
    if elasticsearch_client.indices.exists(index=INDEX):
            elasticsearch_client.indices.delete(index=INDEX)

    elasticsearch_client.indices.create(index=INDEX)

    print(f"Loading data from ${FILE}")
    # metadata_keys = ["name", "summary", "url", "category", "updated_at"]
    metadata_keys = []
    iid_docs = []

    # Loop through files and index documents
    for file in os.listdir(f"{FILE}"):
        with open(os.path.join(FILE, file), "rt") as f:
            print(f"Indexing {file}...")
            for doc in json.loads(f.read()):
                iid_docs.append(
                    Document(
                        page_content=doc["content"],
                        metadata={k: doc.get(k) for k in metadata_keys},
                    )
                )

        print(f"Loaded {len(iid_docs)} documents")

        # Split documents into chunks with 256 character overlap
        text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=512, chunk_overlap=256
        )

        docs = text_splitter.transform_documents(iid_docs)

        print(f"Split {len(iid_docs)} documents into {len(docs)} chunks")

        # Index all documents for the given file
        ElasticsearchStore.from_documents(
            docs,
            es_connection=elasticsearch_client,
            index_name=INDEX,
            strategy=ElasticsearchStore.SparseVectorRetrievalStrategy(model_id=ELSER_MODEL),
            bulk_kwargs={
                "request_timeout": 1200,
            },
        )


if __name__ == "__main__":
    main()
