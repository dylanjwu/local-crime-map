INSERT INTO
    calls (
        id,
        call_start,
        call_end,
        type_id,
        call_location,
        officer_id
    )
SELECT
    "callNum",
    "callStart"::TIMESTAMP,
    "callEnd"::TIMESTAMP,
    "typeId",
    "location",
    "officerId"
FROM
    jsonb_to_recordset(${calls}::JSONB) AS c(
        "callNum" BIGINT,
        "callStart" TEXT,
        "callEnd" TEXT,
        "typeId" INTEGER,
        "location" TEXT,
        "officerId" INTEGER
    );