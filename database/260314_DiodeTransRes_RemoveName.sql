BEGIN;
ALTER TABLE diodes DROP COLUMN diode_name;
ALTER TABLE transistors DROP COLUMN transistor_name;
ALTER TABLE resistors DROP COLUMN resistor_name;
COMMIT;
