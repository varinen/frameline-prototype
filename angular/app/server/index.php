<?php
header('Access-Control-Allow-Origin: *');
$allowedActions = array('get_script', 'list_scripts');
if (isset($_GET['action'] ) && in_array($_GET['action'], $allowedActions)) {
    switch ($_GET['action']) {
    case 'get_script': getScript();
    break;
    case 'list_scripts': listScripts();
    break;
    default: returnEmpty();   
    }
}

function returnEmpty() {
    returnJson('nothing');
}

function getScript() {
    if (!isset($_GET['filename'])) {
        header('HTTP/1.0 404 Not Found');
        return returnJson('nothing');
    }

    try {
        $content = file_get_contents('storage/' . $_GET['filename']);
    } catch (Exception $e) {
        header('HTTP/1.0 404 Not Found');
        return returnJson('nothing');
    }

    $script = json_decode($content);
    if (!$script) {
        header('HTTP/1.0 404 Not Found');
        return returnJson('nothing');
    }

    returnJson($script);
}

function listScripts() {
    $files = scandir('storage/');
    if ($files) {
        $result = array();
        foreach ($files as $file) {
            if (!is_dir($file) && (substr($file, -4, 4) == 'json')) {
                $result[] = array('filename' => $file);
            }
        }
        returnJson($result);
    } else {
        returnJson('nothing');
    }
}

function returnJson($value, $encode = true) {
    header('Content-Type: application/json');
    if ($encode) {
        echo json_encode($value);
    } else {
        echo $value;
    }

}