
URL="http://localhost:3000/"

if [[ $1 == "POST" ]]; then
    curl -X POST -H 'Content-Type: application/json' -d '{ "name": { "first": "Dylan", "last": "Wu" } }' $URL
else 
    curl -X GET $URL
fi;