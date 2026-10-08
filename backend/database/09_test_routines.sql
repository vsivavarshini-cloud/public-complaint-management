USE public_complaint_db;

CALL register_complaint(2, 1, 1, 'Water leakage near my house');

SELECT count_open_complaints(1) AS open_complaints;

UPDATE complaints
SET status = 'IN_PROGRESS'
WHERE complaint_id = 1;

SELECT * FROM complaint_history ORDER BY history_id DESC;
