from flask import Flask, jsonify, request, Response
from flask_cors import CORS

import os
import sys

app = Flask(__name__)
CORS(app)

@app.cli.command()
def create_index():
    """Create or re-create the Elasticsearch index."""
    

    import index_data

    index_data.main()


if __name__ == "__main__":
    app.run(port=3001, debug=True)
