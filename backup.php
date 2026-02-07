<?php
session_start();
require_once 'config.php';

/**
 * Script de sauvegarde de la base de données pour Sunuboutique.
 * Ce script génère un fichier SQL contenant la structure (CREATE TABLE) 
 * et les données (INSERT INTO) de toutes les tables de la base de données.
 * 
 * Sécurité : Seul un utilisateur authentifié peut générer une sauvegarde.
 */

// Vérification de l'authentification
if (!isset($_SESSION['user_id'])) { 
    header('HTTP/1.1 403 Forbidden');
    exit("Accès refusé : Vous devez être connecté pour effectuer cette action."); 
}

try {
    // 1. Récupération de la liste de toutes les tables
    $tables = array();
    $result = $pdo->query("SHOW TABLES");
    while ($row = $result->fetch(PDO::FETCH_NUM)) {
        $tables[] = $row[0];
    }

    $return = "-- Sauvegarde de la base de données Sunuboutique
";
    $return .= "-- Générée le : " . date('d-m-Y à H:i:s') . "
";
    $return .= "-- Utilisateur ID : " . $_SESSION['user_id'] . "

";
    $return .= "SET FOREIGN_KEY_CHECKS=0;

";

    // 2. Parcours de chaque table pour extraire la structure et les données
    foreach ($tables as $table) {
        // --- Structure de la table ---
        $return .= "-- Structure de la table `$table` --
";
        $return .= "DROP TABLE IF EXISTS `$table`;
";
        
        $stmtCreate = $pdo->query("SHOW CREATE TABLE `$table` text");
        $rowCreate = $stmtCreate->fetch(PDO::FETCH_NUM);
        $return .= $rowCreate[1] . ";

";

        // --- Données de la table ---
        $return .= "-- Données de la table `$table` --
";
        $stmtData = $pdo->query("SELECT * FROM `$table` text");
        $num_fields = $stmtData->columnCount();

        while ($row = $stmtData->fetch(PDO::FETCH_NUM)) {
            $return .= "INSERT INTO `$table` VALUES(";
            for ($j = 0; $j < $num_fields; $j++) {
                if (isset($row[$j])) {
                    // Échappement des caractères spéciaux pour éviter les erreurs SQL
                    $escaped = addslashes($row[$j]);
                    // Remplacement des sauts de ligne pour une insertion correcte
                    $escaped = str_replace("
", "\
", $escaped);
                    $return .= '"' . $escaped . '"';
                } else {
                    // Gestion des valeurs NULL
                    $return .= 'NULL';
                }
                
                if ($j < ($num_fields - 1)) {
                    $return .= ',';
                }
            }
            $return .= ");
";
        }
        $return .= "

";
    }

    $return .= "SET FOREIGN_KEY_CHECKS=1;
";

    // 3. Préparation du téléchargement du fichier
    $filename = 'backup_sunuboutique_' . date('d-m-Y_H-i') . '.sql';
    
    // Définition des headers HTTP pour déclencher le téléchargement
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Transfer-Encoding: binary');
    header('Content-Length: ' . strlen($return));
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    
    // Envoi du contenu SQL
    echo $return;
    exit;

} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error');
    exit("Erreur de base de données lors de la sauvegarde : " . $e->getMessage());
} catch (Exception $e) {
    header('HTTP/1.1 500 Internal Server Error');
    exit("Erreur système lors de la sauvegarde : " . $e->getMessage());
}