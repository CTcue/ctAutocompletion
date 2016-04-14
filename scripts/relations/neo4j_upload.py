import os.path
import tornado
import argparse
import time
import urllib2
from bs4 import BeautifulSoup

from flask import Flask, request, json
from flask.ext.cors import CORS
from werkzeug.wrappers import Response
from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer

from py2neo import authenticate, Graph, Relationship

app = Flask(__name__)
app.debug = True
CORS(app)


def safe_filename(filename):
    name = "".join([c for c in filename if c.isalpha() or c.isdigit() or c == ' ']).rstrip()
    filename = "%s_%s.json" % (time.time(), name)
    return os.path.join("./uploads/", filename)


def extract_name(concept):
    if "name" in concept:
        return concept["name"]
    elif "term" in concept:
        return concept["term"]
    elif "drug" in concept:
        return concept["drug"]

    return False


@app.route('/', methods=['GET', 'POST'])
def status():
    return json.dumps({"success": True***REMOVED***)


@app.route('/add', methods=['POST'])
def add():
    try:
        body = request.get_json(force=True)
    except:
        return Response('Provide valid json data', 400)

    # Check if we have parent + concepts
    if not "parent" in body:
        return Response('Provide a name for the parent node of the group.', 400)
    elif not "concepts" in body or len(body["concepts"]) == 0:
        return Response('There are no group concepts?', 400)

    try:
        authenticate("localhost:7474", body["neo4j"]["username"], body["neo4j"]["password"])
        db = Graph()
    except Exception as err:
        print err
        return Response('Provide valid neo4j credentials', 400)

    # If request is ok, store it in /uploads
    # Can now remove neo4j info

    # body.pop("neo4j", None)
    # with open(safe_filename(body["parent"]["name"]), 'wb') as out:
    #     json.dump(body, out)


    # Create group
    group = db.merge_one("Group", "name", body["parent"]["name"])
    group['abbr'] = body["parent"].get("abbr", "")
    group['description'] = body["parent"].get("description", "")
    group.push()

    for concept in body["concepts"]:
        concept_name = extract_name(concept)

        # If has a concept name -> create group relation
        if concept_name:
            c1 = db.merge_one("Concept", "name", concept_name.lower())
            for k, val in concept.iteritems():
                # Skip empty value or possible name dupes
                if not val or k in ["name", "term", "drug"]:
                    continue

                c1[k] = val

            c1.push()
            db.create_unique(Relationship(c1, "is_part_of", group))


    result = { "msg": "Added %s with %s concepts" % (body["parent"]["name"], len(body["concepts"]))***REMOVED***
    return Response(json.dumps(result), status=200, mimetype='application/json')


@app.route('/extract', methods=['POST'])
def extract():
    try:
        body = request.get_json(force=True)
    except:
        return Response('Provide valid json data', 400)

    result = {
        "title" : "",
        "description": "",

        "tables": []
***REMOVED***

    try:
        wiki_url = body["url"]
        html = urllib2.urlopen(wiki_url).read()
        soup = BeautifulSoup(html, "html.parser")

        result["title"] = soup.find("h1", { "id" : "firstHeading" ***REMOVED***).text.strip()

        for div in soup.findAll("div", {'id': "mw-content-text"***REMOVED***):
            for p in div.findAll('p')[0:1]:
                result["description"] = p.text.strip();

        for table in soup.findAll('table', {'class': 'wikitable'***REMOVED***):
            rows = []

            for row in table.findAll('tr')[1:]:
                data = []

                # Add column data (remove unneeded whitespace)
                for cell in row.findAll('td'):
                    data.append(cell.text.strip())

                rows.append(data)

            result["tables"].append(rows)

    except Exception as err:
        print err
        return Response('Provide a valid wikipedia url', 400)

    return Response(json.dumps(result), status=200, mimetype='application/json')


@app.route('/clear', methods=['POST'])
def clear():
    try:
        body = request.get_json(force=True)
    except:
        return Response('Provide valid json data', 400)

    try:
        authenticate("localhost:7474", body["neo4j"]["username"], body["neo4j"]["password"])
        db = Graph()

        # Clear all
        db.delete_all()

        # Index your data
        db.cypher.execute("CREATE INDEX ON :Group(name)")
        db.cypher.execute("CREATE INDEX ON :Concept(name)")
        db.cypher.execute("CREATE INDEX ON :Concept(cui)")

    except Exception as err:
        print err
        return Response('Provide valid neo4j credentials (or maybe it is turned off)', 400)

    return Response('Neo4j is cleared', 200)


# API endpoint to update neo4j indexes etc.
@app.route('/update-indexes', methods=['POST'])
def update_indexes():
    try:
        body = request.get_json(force=True)
        authenticate("localhost:7474", body["neo4j"]["username"], body["neo4j"]["password"])
        db = Graph()

        # Index your data
        db.cypher.execute("CREATE INDEX ON :Group(name)")
        db.cypher.execute("CREATE INDEX ON :Concept(name)")
        db.cypher.execute("CREATE INDEX ON :Concept(cui)")
    except Exception as err:
        pass

    return Response('Indexes updated.', 200)


@app.route('/list-groups', methods=['POST'])
def list():
    try:
        body = request.get_json(force=True)
    except:
        return Response('Provide valid json data', 400)

    groups = []

    try:
        authenticate("localhost:7474", body["neo4j"]["username"], body["neo4j"]["password"])
        db = Graph()

        for node in db.find("Group"):
            groups.append(node.properties)

    except Exception as err:
        print err
        return Response('Provide valid neo4j credentials (or maybe it is turned off)', 400)

    return Response(json.dumps({"groups": groups***REMOVED***), 200)


@app.route('/remove-group', methods=['POST'])
def remove():
    try:
        body = request.get_json(force=True)
    except:
        return Response('Provide valid json data', 400)

    try:
        authenticate("localhost:7474", body["neo4j"]["username"], body["neo4j"]["password"])

        # Remove group + relations
        db = Graph()
        db.cypher.execute("MATCH (g:Group {name: {N***REMOVED*** ***REMOVED***) OPTIONAL MATCH (n)<-[r]-(c) DELETE r,n,c", {"N": body["group_name"]***REMOVED***)


    except Exception as err:
        print err
        return Response('Provide valid neo4j credentials (or maybe it is turned off)', 400)

    return Response("Group removed", 200)



@app.route('/', defaults={'path': ''***REMOVED***)
@app.route('/<path:path>', methods=['GET', 'POST'])
def catchall(path):
    return Response('404: Use POST /add', 404)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="neo4j storage API")
    parser.add_argument('--host', dest='host', default='127.0.0.1',
                        help='Host to listen on.')
    parser.add_argument('--port', dest='port', default=4083, type=int,
                        help='Port to listen on.')
    parser.add_argument('--threads', dest='threads', default=1, type=int,
                        help='Number of threads.')
    args = parser.parse_args()

    http_server = HTTPServer(WSGIContainer(app))
    http_server.bind(args.port, address=args.host)
    http_server.start(args.threads)

    print "Neo4j upload system running on %s:%s" % (args.host, args.port)
    ioloop = tornado.ioloop.IOLoop().instance()
    ioloop.start()