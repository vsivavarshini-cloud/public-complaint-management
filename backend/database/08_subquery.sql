USE public_complaint_db;

SELECT
    cat.category_id,
    cat.category_name,
    COUNT(c.complaint_id) AS complaint_count
FROM categories cat
LEFT JOIN complaints c ON cat.category_id = c.category_id
GROUP BY cat.category_id, cat.category_name
HAVING COUNT(c.complaint_id) > (
    SELECT AVG(complaint_count)
    FROM (
        SELECT cat2.category_id,
               COUNT(c2.complaint_id) AS complaint_count
        FROM categories cat2
        LEFT JOIN complaints c2 ON cat2.category_id = c2.category_id
        GROUP BY cat2.category_id
    ) counts
);
