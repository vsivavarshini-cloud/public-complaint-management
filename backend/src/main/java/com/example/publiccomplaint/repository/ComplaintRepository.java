package com.example.publiccomplaint.repository;

import com.example.publiccomplaint.dto.AboveAverageCategoryResponse;
import com.example.publiccomplaint.dto.ComplaintResponse;
import com.example.publiccomplaint.dto.HistoryResponse;
import com.example.publiccomplaint.dto.IdNameResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Types;
import java.util.List;
import java.util.Optional;

@Repository
public class ComplaintRepository {

    private final JdbcTemplate jdbcTemplate;

    public ComplaintRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private ComplaintResponse mapComplaint(java.sql.ResultSet rs) throws java.sql.SQLException {
        return new ComplaintResponse(
                rs.getInt("complaint_id"),
                rs.getInt("citizen_id"),
                rs.getString("citizen_name"),
                rs.getInt("category_id"),
                rs.getString("category_name"),
                (Integer) rs.getObject("officer_id"),
                rs.getString("officer_name"),
                rs.getString("description"),
                rs.getString("status"),
                rs.getTimestamp("created_at").toLocalDateTime()
        );
    }

    private static final String COMPLAINT_DETAILS_SQL = """
            SELECT c.complaint_id,
                   c.citizen_id,
                   ci.name AS citizen_name,
                   c.category_id,
                   cat.category_name,
                   c.officer_id,
                   o.name AS officer_name,
                   c.description,
                   c.status,
                   c.created_at
            FROM complaints c
            JOIN citizens ci ON c.citizen_id = ci.citizen_id
            JOIN categories cat ON c.category_id = cat.category_id
            LEFT JOIN officers o ON c.officer_id = o.officer_id
            """;

    public List<ComplaintResponse> findAllWithDetails() {
        return jdbcTemplate.query(
                COMPLAINT_DETAILS_SQL + " ORDER BY c.complaint_id DESC",
                (rs, rowNum) -> mapComplaint(rs)
        );
    }

    public Optional<ComplaintResponse> findById(Integer complaintId) {
        List<ComplaintResponse> result = jdbcTemplate.query(
                COMPLAINT_DETAILS_SQL + " WHERE c.complaint_id = ?",
                (rs, rowNum) -> mapComplaint(rs),
                complaintId
        );
        return result.stream().findFirst();
    }

    public void registerComplaint(Integer citizenId, Integer categoryId, Integer officerId, String description) {
        jdbcTemplate.update(connection -> {
            var statement = connection.prepareCall("CALL register_complaint(?, ?, ?, ?)");
            statement.setInt(1, citizenId);
            statement.setInt(2, categoryId);
            if (officerId == null) {
                statement.setNull(3, Types.INTEGER);
            } else {
                statement.setInt(3, officerId);
            }
            statement.setString(4, description);
            return statement;
        });
    }

    public Long getLastInsertedId() {
        return jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
    }

    public List<AboveAverageCategoryResponse> findCategoriesAboveAverage() {
        String sql = """
                SELECT cat.category_id,
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
                )
                ORDER BY complaint_count DESC
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new AboveAverageCategoryResponse(
                rs.getInt("category_id"),
                rs.getString("category_name"),
                rs.getLong("complaint_count")
        ));
    }

    public int countOpenComplaintsForOfficer(Integer officerId) {
        Integer result = jdbcTemplate.queryForObject(
                "SELECT count_open_complaints(?)",
                Integer.class,
                officerId
        );
        return result == null ? 0 : result;
    }

    public List<HistoryResponse> findHistory(Integer complaintId) {
        String sql = """
                SELECT history_id, complaint_id, old_status, new_status, changed_at
                FROM complaint_history
                WHERE complaint_id = ?
                ORDER BY history_id DESC
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new HistoryResponse(
                rs.getInt("history_id"),
                rs.getInt("complaint_id"),
                rs.getString("old_status"),
                rs.getString("new_status"),
                rs.getTimestamp("changed_at").toLocalDateTime()
        ), complaintId);
    }

    public int updateStatus(Integer complaintId, String status) {
        return jdbcTemplate.update(
                "UPDATE complaints SET status = ? WHERE complaint_id = ?",
                status,
                complaintId
        );
    }

    public List<IdNameResponse> findCitizens() {
        return jdbcTemplate.query(
                "SELECT citizen_id AS id, name FROM citizens ORDER BY citizen_id",
                (rs, rowNum) -> new IdNameResponse(rs.getInt("id"), rs.getString("name"))
        );
    }

    public List<IdNameResponse> findCategories() {
        return jdbcTemplate.query(
                "SELECT category_id AS id, category_name AS name FROM categories ORDER BY category_id",
                (rs, rowNum) -> new IdNameResponse(rs.getInt("id"), rs.getString("name"))
        );
    }

    public List<IdNameResponse> findOfficers() {
        return jdbcTemplate.query(
                "SELECT officer_id AS id, name FROM officers ORDER BY officer_id",
                (rs, rowNum) -> new IdNameResponse(rs.getInt("id"), rs.getString("name"))
        );
    }

    public Optional<String> findOfficerName(Integer officerId) {
        List<String> names = jdbcTemplate.query(
                "SELECT name FROM officers WHERE officer_id = ?",
                (rs, rowNum) -> rs.getString("name"),
                officerId
        );
        return names.stream().findFirst();
    }
}
