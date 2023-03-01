## Local crime map

##### Objective: Provide map representation of publically available police call data from the Portland maine police dept


This projects includes the following steps:

- Backend
    - Scrape pdfs periodically from website; store as S3 objects (using python requests, beautiful soup, and s3)
    - Parse pdfs into json objects and insert into RDS postgres or mysql databases (using node, postgres/mysql)
    - create express routes for getting data, querying and filtering data, and perhaps eventually modifying and adding data
    - Create scheduled pipeline to do the above 2 tasks
    - Express the current filtered data as a json file
- Frontend
    - Create a vue or react app using mapbox to display a map of Portland maine with data points representing crime calls 
    - Use mapbox geocode to convert minimal address strings to long/lat coordinates to plot on the map
    - Add advanced filtering by time, location, or officer
    - Show box of information when hovering over event
- Deployment
    - Deploy using docker and some AWS hosting service like fargate or ecs
