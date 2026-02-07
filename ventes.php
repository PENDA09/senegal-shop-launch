<?php
session_start();
require_once 'config.php';

// Vérification de l'authentification
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$user_id = $_SESSION['user_id'];

// Récupération de l'ID de la boutique
$stmt = $pdo->prepare("SELECT id FROM shops WHERE user_id = ?");
$stmt->execute([$user_id]);
$shop = $stmt->fetch();

if (!$shop) {
    die("Boutique non trouvée.");
}
$shop_id = $shop['id'];

// Initialisation des filtres de date
$start_date = isset($_POST['start_date']) ? $_POST['start_date'] : date('Y-m-01');
$end_date = isset($_POST['end_date']) ? $_POST['end_date'] : date('Y-m-d');

// Construction de la requête SQL
$sql = "SELECT s.*, p.nom as product_name 
        FROM sales s 
        JOIN products p ON s.product_id = p.id 
        WHERE s.shop_id = ? 
        AND DATE(s.sale_date) BETWEEN ? AND ? 
        ORDER BY s.sale_date DESC";

$stmtVentes = $pdo->prepare($sql);
$stmtVentes->execute([$shop_id, $start_date, $end_date]);
$ventes = $stmtVentes->fetchAll();

// Logique d'exportation CSV
if (isset($_POST['export_csv'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=ventes_' . $start_date . '_au_' . $end_date . '.csv');
    
    $output = fopen('php://output', 'w');
    // Ajouter BOM pour Excel UTF-8
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    fputcsv($output, ['ID Vente', 'Date', 'Produit', 'Quantité', 'Total (FCFA)']);
    
    foreach ($ventes as $v) {
        fputcsv($output, [
            $v['id'],
            date('d/m/Y H:i', strtotime($v['sale_date'])),
            $v['product_name'],
            $v['quantity'],
            $v['total_amount']
        ]);
    }
    fclose($output);
    exit();
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historique des Ventes - Sunuboutique</title>
    <style>
        :root {
            --primary: #1a73e8;
            --success: #2ecc71;
            --danger: #e74c3c;
            --dark: #1c2431;
            --bg: #f4f7f6;
        }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: var(--bg); margin: 0; padding: 20px; color: #2d3436; }
        .container { max-width: 1000px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        h2 { color: var(--dark); margin-top: 0; display: flex; align-items: center; gap: 10px; }
        
        .filter-section { 
            background: #f8f9fc; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 25px; 
            border: 1px solid #e1e4e8;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: flex-end;
        }
        
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        label { font-size: 0.85rem; font-weight: 600; color: #636e72; }
        input[type="date"] { padding: 8px 12px; border: 1px solid #ddd; border-radius: 5px; outline: none; }
        
        .btn { 
            padding: 10px 20px; 
            border-radius: 5px; 
            border: none; 
            cursor: pointer; 
            font-weight: 600; 
            transition: opacity 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn-filter { background: var(--primary); color: white; }
        .btn-export { background: var(--success); color: white; }
        .btn:hover { opacity: 0.9; }

        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #f8f9fc; text-align: left; padding: 15px 12px; border-bottom: 2px solid #edf2f7; color: #4a5568; font-size: 0.9rem; }
        td { padding: 12px; border-bottom: 1px solid #edf2f7; font-size: 0.95rem; }
        tr:hover { background: #fdfdfd; }
        
        .empty-state { text-align: center; padding: 40px; color: #a0aec0; }
        .back-link { display: inline-block; margin-top: 20px; color: var(--primary); text-decoration: none; font-weight: 500; }
        .back-link:hover { text-decoration: underline; }

        @media (max-width: 768px) {
            .filter-section { flex-direction: column; align-items: stretch; }
            .btn { width: 100%; justify-content: center; }
            table { display: block; overflow-x: auto; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>📊 Historique des Ventes</h2>
        
        <form method="POST" class="filter-section">
            <div class="form-group">
                <label>Date de début</label>
                <input type="date" name="start_date" value="<?php echo $start_date; ?>">
            </div>
            <div class="form-group">
                <label>Date de fin</label>
                <input type="date" name="end_date" value="<?php echo $end_date; ?>">
            </div>
            <button type="submit" class="btn btn-filter">Filtrer</button>
            <button type="submit" name="export_csv" class="btn btn-export">Exporter CSV</button>
        </form>

        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Total (FCFA)</th>
                </tr>
            </thead>
            <tbody>
                <?php if (count($ventes) > 0): ?>
                    <?php foreach ($ventes as $v): ?>
                        <tr>
                            <td><?php echo date('d/m/Y H:i', strtotime($v['sale_date'])); ?></td>
                            <td><strong><?php echo htmlspecialchars($v['product_name']); ?></strong></td>
                            <td><?php echo $v['quantity']; ?></td>
                            <td><?php echo number_format($v['total_amount'], 0, ',', ' '); ?> F</td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="4" class="empty-state">Aucune vente enregistrée pour cette période.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>

        <a href="dashboard.php" class="back-link">⬅ Retour au tableau de bord</a>
    </div>
</body>
</html>