package com.example.expense_management_system.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CategorySchemaMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        List<String> legacyIndexes = jdbcTemplate.queryForList("""
                SELECT INDEX_NAME
                FROM INFORMATION_SCHEMA.STATISTICS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'category'
                  AND COLUMN_NAME = 'name'
                  AND NON_UNIQUE = 0
                GROUP BY INDEX_NAME
                HAVING COUNT(*) = 1
                """, String.class);

        for (String indexName : legacyIndexes) {
            if (indexName != null && !"PRIMARY".equalsIgnoreCase(indexName)) {
                jdbcTemplate.execute("ALTER TABLE category DROP INDEX " + indexName);
            }
        }
    }
}
