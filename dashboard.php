<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

// Récupération des infos de l'utilisateur et de sa boutique
$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT s.*, u.email, u.plan FROM shops s JOIN users u ON s.user_id = u.id WHERE u.id = ?");
$stmt->execute([$user_id]);
$shop = $stmt->fetch();

if (!$shop) {
    die("Boutique non trouvée.");
}

// Logic pour ajouter une dépense
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['ajouter_depense'])) {
    $motif = htmlspecialchars($_POST['motif']);
    $montant = floatval($_POST['montant']);
    $shop_id = $shop['id'];

    if (!empty($motif) && $montant > 0) {
        $stmtExp = $pdo->prepare("INSERT INTO expenses (shop_id, motif, montant, date_depense) VALUES (?, ?, ?, NOW())");
        $stmtExp->execute([$shop_id, $motif, $montant]);
        header('Location: dashboard.php?msg=depense_ajoutee');
        exit();
    }
}

// Statistiques rapides
$stmtStats = $pdo->prepare("SELECT COUNT(*) as total_prod FROM products WHERE shop_id = ?");
$stmtStats->execute([$shop['id']]);
$stats = $stmtStats->fetch();

// Liste des produits
$stmtProd = $pdo->prepare("SELECT * FROM products WHERE shop_id = ? ORDER BY id DESC LIMIT 10");
$stmtProd->execute([$shop['id']]);
$produits = $stmtProd->fetchAll();

// Liste des dépenses récentes
$stmtGetExp = $pdo->prepare("SELECT * FROM expenses WHERE shop_id = ? ORDER BY date_depense DESC LIMIT 5");
$stmtGetExp->execute([$shop['id']]);
$recent_expenses = $stmtGetExp->fetchAll();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tableau de Bord - Sunuboutique</title>
    <style>
        :root {
            --primary: #1a73e8;
            --bg: #f8f9fc;
            --sidebar-width: 260px;
            --success: #2ecc71;
        }
        body { font-family: 'Segoe UI', sans-serif; background: var(--bg); margin: 0; display: flex; }
        
        /* Sidebar */
        .sidebar {
            width: var(--sidebar-width);
            background: #1c2431;
            height: 100vh;
            color: white;
            position: fixed;
            padding: 20px 0;
        }
        .sidebar h2 { padding: 0 20px; font-size: 1.2rem; margin-bottom: 30px; }
        .sidebar a {
            display: block;
            padding: 15px 20px;
            color: #a0aec0;
            text-decoration: none;
            transition: 0.3s;
        }
        .sidebar a:hover, .sidebar a.active { background: #2d3748; color: white; border-left: 4px solid var(--primary); }
        .sidebar a.logout { color: #e74c3c; margin-top: 50px; }

        /* Main Content */
        .main-content {
            margin-left: var(--sidebar-width);
            flex: 1;
            padding: 30px;
        }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .stat-card h3 { margin: 0; font-size: 0.9rem; color: #718096; }
        .stat-card p { margin: 10px 0 0; font-size: 1.5rem; font-weight: bold; color: var(--primary); }

        .table-container { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 12px; border-bottom: 2px solid #edf2f7; color: #4a5568; }
        td { padding: 12px; border-bottom: 1px solid #edf2f7; }
        
        .btn-add { background: var(--primary); color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; border: none; cursor: pointer; font-size: 1rem; }
        .btn-add:hover { opacity: 0.9; }

        input[type="text"], input[type="number"] {
            width: 100%;
            padding: 12px;
            margin-top: 8px;
            border: 1px solid #edf2f7;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 1rem;
        }

        .expense-grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 20px;
        }

        .alert {
            padding: 15px;
            background: #d4edda;
            color: #155724;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
        }

        @media (max-width: 1024px) {
            .expense-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <h2>Sunuboutique</h2>
        <a href="dashboard.php" class="active">🏠 Tableau de bord</a>
        <a href="ajouter-produit.php">➕ Ajouter un produit</a>
        <a href="ventes.php">📊 Historique des Ventes</a>
        <a href="expenses.php">💸 Dépenses</a>
        <a href="equipe.php">👥 Équipe</a>
        <a href="abonnement.php">💳 Mon Plan</a>
        <a href="boutique.php?id=<?php echo $shop['id']; ?>" target="_blank">👁️ Voir ma boutique</a>
        <a href="logout.php" class="logout">🚪 Déconnexion</a>
    </div>

    <div class="main-content">
        <div class="header">
            <h1>Bienvenue, <?php echo htmlspecialchars($shop['nom_boutique'] ?? $shop['nom']); ?></h1>
            <a href="ajouter-produit.php" class="btn-add">Nouveau Produit</a>
        </div>

        <?php if (isset($_GET['msg']) && $_GET['msg'] === 'depense_ajoutee'): ?>
            <div class="alert">La dépense a été ajoutée avec succès !</div>
        <?php endif; ?>

        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Produits</h3>
                <p><?php echo $stats['total_prod']; ?></p>
            </div>
            <div class="stat-card">
                <h3>Plan Actuel</h3>
                <p style="font-size: 1.1rem;"><?php echo $shop['plan']; ?></p>
            </div>
            <div class="stat-card">
                <h3>Ventes (Auj.)</h3>
                <p>0 F</p>
            </div>
        </div>

        <div class="table-container">
            <h3>Produits Récents</h3>
            <table>
                <tr>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Stock</th>
                    <th>Action</th>
                </tr>
                <?php foreach($produits as $p): ?>
                <tr>
                    <td><?php echo htmlspecialchars($p['nom'] ?? $p['nom_produit']); ?></td>
                    <td><?php echo number_format($p['prix'] ?? $p['prix_vente'], 0, ',', ' '); ?> F</td>
                    <td><?php echo $p['stock'] ?? $p['stock_actuel']; ?></td>
                    <td>
                        <a href="modifier.php?id=<?php echo $p['id']; ?>" style="color:var(--primary);">Modifier</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </table>
        </div>

        <div class="expense-grid">
            <div class="table-container">
                <h3>Ajouter une Dépense</h3>
                <form method="POST">
                    <div style="margin-bottom: 15px;">
                        <label>Motif de la dépense</label>
                        <input type="text" name="motif" placeholder="Ex: Loyer, Electricité..." required>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label>Montant (FCFA)</label>
                        <input type="number" name="montant" placeholder="0" required>
                    </div>
                    <button type="submit" name="ajouter_depense" class="btn-add" style="width: 100%;">Ajouter la dépense</button>
                </form>
            </div>

            <div class="table-container">
                <h3>Dépenses Récentes</h3>
                <table>
                    <tr>
                        <th>Date</th>
                        <th>Motif</th>
                        <th>Montant</th>
                    </tr>
                    <?php if (empty($recent_expenses)): ?>
                    <tr>
                        <td colspan="3" style="text-align:center; color: #a0aec0; padding: 20px;">Aucune dépense enregistrée</td>
                    </tr>
                    <?php else: ?>
                        <?php foreach($recent_expenses as $e): ?>
                        <tr>
                            <td><?php echo date('d/m/Y', strtotime($e['date_depense'])); ?></td>
                            <td><?php echo htmlspecialchars($e['motif']); ?></td>
                            <td><?php echo number_format($e['montant'], 0, ',', ' '); ?> F</td>
                        </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </table>
            </div>
        </div>
    </div>
</body>
</html>