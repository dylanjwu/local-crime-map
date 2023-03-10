INSERT INTO
    calls (
        id,
        call_start,
        call_end,
        type_id,
        call_location,
        officer_id,
        coordinates
    )
SELECT
    "callNum",
    "callStart"::TIMESTAMP,
    "callEnd"::TIMESTAMP,
    "typeId",
    "location",
    "officerId",
    POINT("longitude", "latitude")
FROM
    jsonb_to_recordset(${calls}::JSONB) AS c(
        "callNum" BIGINT,
        "callStart" TEXT,
        "callEnd" TEXT,
        "typeId" INTEGER,
        "location" TEXT,
        "officerId" INTEGER,
        "longitude" FLOAT,
        "latitude" FLOAT
    );