USE public_complaint_db;

INSERT INTO citizens (name, phone, email, address) VALUES
('Arun Kumar', '9876543210', 'arun@gmail.com', 'Chennai'),
('Priya Sharma', '9876543211', 'priya@gmail.com', 'Tambaram'),
('Karthik Raj', '9876543212', 'karthik@gmail.com', 'Avadi'),
('Divya S', '9876543213', 'divya@gmail.com', 'Chengalpattu'),
('Rahul M', '9876543214', 'rahul@gmail.com', 'Tiruvallur');

INSERT INTO categories (category_name, description) VALUES
('Water Supply', 'Complaints related to water supply'),
('Roads', 'Complaints related to roads and potholes'),
('Electricity', 'Complaints related to electricity supply'),
('Sanitation', 'Complaints related to garbage and sanitation');

INSERT INTO officers (name, department, phone) VALUES
('Suresh Kumar', 'Water Department', '9000000001'),
('Meena Devi', 'Road Department', '9000000002'),
('Vijay Anand', 'Electricity Department', '9000000003');

INSERT INTO complaints
(citizen_id, category_id, officer_id, description, status) VALUES
(1, 1, 1, 'No water supply for two days', 'OPEN'),
(2, 1, 1, 'Low water pressure in the area', 'IN_PROGRESS'),
(3, 1, 1, 'Water pipeline leakage', 'OPEN'),
(4, 1, 1, 'Irregular water supply', 'RESOLVED'),
(5, 1, 1, 'Contaminated water supply', 'OPEN'),
(1, 2, 2, 'Large pothole on main road', 'OPEN'),
(2, 2, 2, 'Damaged road near school', 'IN_PROGRESS'),
(3, 2, 2, 'Road needs repair', 'RESOLVED'),
(4, 2, 2, 'Broken street road surface', 'OPEN'),
(5, 3, 3, 'Frequent power cuts', 'OPEN'),
(1, 3, 3, 'Street light not working', 'RESOLVED'),
(2, 3, 3, 'Low voltage problem', 'IN_PROGRESS'),
(3, 4, NULL, 'Garbage not collected', 'OPEN'),
(4, 4, NULL, 'Overflowing garbage bin', 'OPEN'),
(5, 4, NULL, 'Poor sanitation in locality', 'RESOLVED');
