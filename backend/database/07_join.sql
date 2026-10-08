USE public_complaint_db;

SELECT
    c.complaint_id,
    ci.name AS citizen_name,
    cat.category_name,
    o.name AS officer_name,
    c.description,
    c.status,
    c.created_at
FROM complaints c
JOIN citizens ci ON c.citizen_id = ci.citizen_id
JOIN categories cat ON c.category_id = cat.category_id
LEFT JOIN officers o ON c.officer_id = o.officer_id;
