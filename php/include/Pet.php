<?php

    class Pet{
        private $idPet;
        private $namePet;


    //getters
        public function getIdPet() {return $this->idPet;}
        public function getNamePet() {return $this->namePet;}
    //Setters
        public function setIdPet($idPet){$this->idePet = $idPet;}
        public function setNamePet($namePet){$this->namePet= $namePet;}

    //Constructor
        public function __construct($row){
            $this->idPet = $row['id'];
            $this->namePet = $row['nombre'];
        }
        
    }

?>