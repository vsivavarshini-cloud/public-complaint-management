USE public_complaint_db;
DROP FUNCTION IF EXISTS count_open_complaints;
DELIMITER //
CREATE FUNCTION count_open_complaints(p_officer_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE open_count INT;
    SELECT COUNT(*) INTO open_count
    FROM complaints
    WHERE officer_id = p_officer_id AND status = 'OPEN';
    RETURN open_count;
END //
DELIMITER ;
