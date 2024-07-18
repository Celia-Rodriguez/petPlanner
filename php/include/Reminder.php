<?php

    class Reminder{
        private $idReminder;
        private $idPet;
        private $idTypeReminder;
        private $timePeriod;
        private $plannedDate;
        private $doneDate;
        private $details;
        private $color;
        private $typeReminder;
        

    //getters
        public function getIdPReminder() {return $this->idReminder;}
        public function getIdPet() {return $this->idPet;}
        public function getIdTypeReminder() {return $this->idTypeReminder;}
        public function getTimePeriod() {return $this->timePeriod;}
        public function getPlannedDate() {return $this->plannedDate;}
        public function getDoneDate() {return $this->doneDate;}
        public function getDetails() {return $this->details;}
        public function getColor() {return $this->color;}
        public function getTypeReminder() {return $this->typeReminder;}

    //Setters
        public function setIdPReminder($idReminder) {$this->idReminder  = $idReminder;}
        public function setIdPet($idPet) {$this->idPet = $idPet;}
        public function setIdTypeReminder($idTypeReminder) {$this->idTypeReminder = $idTypeReminder;}
        public function setTimePeriod($timePeriod) { $this->timePeriod = $timePeriod;}
        public function setPlannedDate($plannedDate) { $this->plannedDate = $plannedDate;}
        public function setDoneDate($doneDate) { $this->doneDate = $doneDate;}
        public function setDetails($details) { $this->details = $details;}
        public function setColor($color) { $this->color = $color;}
        public function setTypeReminder($typeReminder) {$this->typeReminder = $typeReminder;}
        
    //Constructor
        public function __construct($row){
            $this->idReminder = $row['id'];
            $this->idPet = $row['id_pet'];
            $this->idTypeReminder = $row['id_tipo'];
            $this->timePeriod = $row['periodo_tiempo'];
            $this->plannedDate = $row['fecha_prevista'];
            $this->doneDate = $row['fecha_realizada'];
            $this->details = $row['detalles'];
            $this->color = $row['color_reminder'];
           $this->typeReminder = $row['nombre_tipo'] .' ('. $row['tipo'] .')';
        }
    }

?>