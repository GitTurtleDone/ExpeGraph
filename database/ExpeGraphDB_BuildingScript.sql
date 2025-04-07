-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ExpeGraph
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema ExpeGraph
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ExpeGraph` DEFAULT CHARACTER SET utf8 ;
USE `ExpeGraph` ;

-- -----------------------------------------------------
-- Table `ExpeGraph`.`Batches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ExpeGraph`.`Batches` (
  `BatchID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `BatchName` VARCHAR(30) NOT NULL,
  `BatchDescription` VARCHAR(100) NULL COMMENT 'Describe the uniqueness and purpose of the batch\n',
  `FabricationDate` DATE NOT NULL COMMENT 'The date when the fabrication finishes',
  `Treatment` VARCHAR(200) NULL COMMENT 'Treatments that are common to all samples in the batch',
  PRIMARY KEY (`BatchID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ExpeGraph`.`Samples`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ExpeGraph`.`Samples` (
  `SampleID` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Should include order number, quarter, pieces number. For example, O5632SE12 means the order 5632, quarter south east, piece 12. It would correspond to a Dev folder.',
  `SampleName` VARCHAR(5) NOT NULL,
  `Size` FLOAT NOT NULL COMMENT 'Subtrate size in mm, for example, 5 would mean 5 by 5 square',
  `Treatment` VARCHAR(100) NULL COMMENT 'Unique treatment of the device in addition to the batch treatment',
  `Wafer` VARCHAR(20) NOT NULL COMMENT 'Typically, Material + Order number. For example, Ga2O3O5632. But can be adjusted as needed. For example, HVPE 10 um, or MBE GO etc.',
  `Quarter` VARCHAR(3) NULL COMMENT 'SE, NE, SW, NW, SE1, SE2, NW1, etc.',
  `PieceNumber` TINYINT UNSIGNED NULL,
  `BatchID` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`SampleID`),
  INDEX `batch_id_fk_idx` (`BatchID` ASC) VISIBLE,
  CONSTRAINT `batch_id_fk`
    FOREIGN KEY (`BatchID`)
    REFERENCES `ExpeGraph`.`Batches` (`BatchID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ExpeGraph`.`Devices`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ExpeGraph`.`Devices` (
  `DeviceID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `DeviceName` VARCHAR(5) NOT NULL COMMENT 'For example, F01 for diodes which have a diameter of ~800 um (after the employment of shadow mask, and 1000 um before the employmen tof shadow mask)',
  `DeviceType` VARCHAR(10) NOT NULL COMMENT 'dio, trans, or res, .etc',
  `SampleID` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`DeviceID`),
  INDEX `sample_id_fk_idx` (`SampleID` ASC) VISIBLE,
  CONSTRAINT `sample_id_fk`
    FOREIGN KEY (`SampleID`)
    REFERENCES `ExpeGraph`.`Samples` (`SampleID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ExpeGraph`.`Diodes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ExpeGraph`.`Diodes` (
  `DiodeID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `DiodeName` VARCHAR(5) NOT NULL,
  `Size` FLOAT NOT NULL COMMENT 'in micrometer',
  `ChamferRad` FLOAT NULL COMMENT 'Chamfer radius in micrometer. If the device is square, it is not null (it can be zero, if there is no chamfer), if the device is circular, it is null ',
  `BarrierHeight` FLOAT NULL COMMENT 'eV',
  `IdealityFactor` FLOAT NULL,
  `RecRatio` FLOAT NULL COMMENT 'Rectification ratio',
  `BuiltInPotential` FLOAT NULL COMMENT 'V',
  `CarrierConcentration` FLOAT NULL,
  `MaxCurrent` FLOAT NULL,
  `VoltageAtMaxCurrent` FLOAT NULL,
  `BreakdownVoltage` FLOAT NULL COMMENT 'V',
  PRIMARY KEY (`DiodeID`),
  CONSTRAINT `dio_device_id_fk`
    FOREIGN KEY (`DiodeID`)
    REFERENCES `ExpeGraph`.`Devices` (`DeviceID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ExpeGraph`.`MeasurementTypes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ExpeGraph`.`MeasurementTypes` (
  `MeasurementTypeID` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `MeasurementTypeName` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`MeasurementTypeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ExpeGraph`.`Measurements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ExpeGraph`.`Measurements` (
  `MeasurementID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `MeasurementTypeID` SMALLINT UNSIGNED NOT NULL,
  `MeasurementDateTime` DATETIME NULL,
  `DeviceID` INT UNSIGNED NOT NULL,
  INDEX `device_id_fk_idx` (`DeviceID` ASC) VISIBLE,
  PRIMARY KEY (`MeasurementID`),
  INDEX `measurement_type_id_fk_idx` (`MeasurementTypeID` ASC) VISIBLE,
  CONSTRAINT `mes_device_id_fk`
    FOREIGN KEY (`DeviceID`)
    REFERENCES `ExpeGraph`.`Devices` (`DeviceID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `measurement_type_id_fk`
    FOREIGN KEY (`MeasurementTypeID`)
    REFERENCES `ExpeGraph`.`MeasurementTypes` (`MeasurementTypeID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ExpeGraph`.`Transistors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ExpeGraph`.`Transistors` (
  `TransistorID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `TransistorName` VARCHAR(5) NOT NULL,
  `GateWidth` FLOAT NOT NULL COMMENT 'width in micrometer',
  `GateLength` FLOAT NOT NULL COMMENT 'length in micrometer',
  `Mobility` FLOAT NULL COMMENT 'Field-effect Mobility in cm2/(Vs)',
  `OnOffRatio` FLOAT NULL,
  `ThresholdVoltage` FLOAT NULL COMMENT 'Threshold voltage in V\n',
  `SubthresholdSwing` FLOAT NULL COMMENT 'subthreshold swing in mV/dec',
  `SGGap` FLOAT NULL COMMENT 'Gap between source and gate in micrometer',
  `DGGap` FLOAT NULL COMMENT 'Gap between drain and gate in micrometer',
  INDEX `device_id_fk_idx` (`TransistorID` ASC) VISIBLE,
  PRIMARY KEY (`TransistorID`),
  CONSTRAINT `trans_device_id_fk`
    FOREIGN KEY (`TransistorID`)
    REFERENCES `ExpeGraph`.`Devices` (`DeviceID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ExpeGraph`.`TLMs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ExpeGraph`.`TLMs` (
  `TLMID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `SheetResistance` FLOAT NULL COMMENT 'in Ohm/sq',
  `ContactResistance` FLOAT NULL COMMENT 'in Ohm\n',
  `TransferLength` FLOAT NULL COMMENT 'in cm',
  PRIMARY KEY (`TLMID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ExpeGraph`.`Resistors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ExpeGraph`.`Resistors` (
  `ResistorID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ResistorName` VARCHAR(5) NOT NULL,
  `Resistance` FLOAT NULL COMMENT 'in Ohm',
  `Length` FLOAT NOT NULL COMMENT 'Length between two contact \npads in micrometer\n',
  `Width` FLOAT NULL COMMENT 'PadWidth in micrometer',
  `TLMID` INT UNSIGNED NULL,
  PRIMARY KEY (`ResistorID`),
  INDEX `tlm_id_fk_idx` (`TLMID` ASC) VISIBLE,
  CONSTRAINT `tlm_id_fk`
    FOREIGN KEY (`TLMID`)
    REFERENCES `ExpeGraph`.`TLMs` (`TLMID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `res_device_id_fk`
    FOREIGN KEY (`ResistorID`)
    REFERENCES `ExpeGraph`.`Devices` (`DeviceID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ExpeGraph`.`MeasurementData`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ExpeGraph`.`MeasurementData` (
  `MeasurementDataID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `MeasurementID` INT UNSIGNED NOT NULL,
  `ColX` FLOAT NULL,
  `ColY` FLOAT NULL,
  PRIMARY KEY (`MeasurementDataID`),
  INDEX `measurement_id_fk_idx` (`MeasurementID` ASC) VISIBLE,
  CONSTRAINT `measurement_id_fk`
    FOREIGN KEY (`MeasurementID`)
    REFERENCES `ExpeGraph`.`Measurements` (`MeasurementID`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
