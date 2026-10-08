USE public_complaint_db;
DROP PROCEDURE IF EXISTS register_complaint;
DELIMITER //
CREATE PROCEDURE register_complaint(
    IN p_citizen_id INT,
    IN p_category_id INT,
    IN p_officer_id INT,
    IN p_description VARCHAR(500)
)
BEGIN
    INSERT INTO complaints (citizen_id, category_id, officer_id, description, status)
    VALUES (p_citizen_id, p_category_id, p_officer_id, p_description, 'OPEN');
END //
DELIMITER ;
