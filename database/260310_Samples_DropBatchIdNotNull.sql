BEGIN;
ALTER TABLE expegraph.samples ALTER COLUMN batch_id DROP NOT NULL;
ALTER TABLE expegraph.samples
    DROP CONSTRAINT samples_batch_id_fkey,
    ADD CONSTRAINT samples_batch_id_fkey
        FOREIGN KEY (batch_id) REFERENCES expegraph.batches(batch_id) ON DELETE SET NULL;
COMMIT;