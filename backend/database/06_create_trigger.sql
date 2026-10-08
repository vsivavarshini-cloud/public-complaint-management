USE public_complaint_db;

DROP TRIGGER IF EXISTS complaint_status_history;

DELIMITER //
CREATE TRIGGER complaint_status_history
AFTER UPDATE ON complaints
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO complaint_history (
            complaint_id,
            old_status,
            new_status
        )
        VALUES (
            NEW.complaint_id,
            OLD.status,
            NEW.status
        );
    END IF;
END //
DELIMITER ;
