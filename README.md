## Local crime map

##### Objective: Provide map representation of publically available police call data from the Portland maine police dept

Latest project state:

<img width="971" alt="Screen Shot 2023-03-12 at 3 01 22 PM" src="https://user-images.githubusercontent.com/17605743/224566639-f93b99cb-552b-462d-b478-8a98e7bb6567.png">



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


Tasks
- [x] Scrape data from website 
- [x] Parse data as json
- [x] Load JSON into postgres tables
- [x] Express endpoint for getting all calls
- [x] Basic react app -- with mapbox and getting calls
- [ ] Refactor scraping code into puppeteer or something
- [ ] Optimize data insertions and parsing with json streams
- [ ] Set up and automate scheduled pipeline (scrape pdfs -> store in s3 -> parse pdfs -> stream json data into postgres tables -> send debezium message to kafka -> kafka tells the backend which tells the frontend)
