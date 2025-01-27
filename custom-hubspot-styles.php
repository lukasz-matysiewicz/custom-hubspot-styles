<?php
/*
Plugin Name: HubSpot Form Styler
Description: Simple styling for HubSpot forms
Version: 1.0
Author: Matysiewicz Studio
*/

// Prevent direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

function hubspot_styler_enqueue_scripts() {
    // Register and enqueue the script
    wp_enqueue_script(
        'hubspot-styler', 
        plugin_dir_url(__FILE__) . 'js/hubspot-styler.js', 
        array(), 
        '1.0', 
        true
    );
}
add_action('wp_enqueue_scripts', 'hubspot_styler_enqueue_scripts');

// Optional: Add activation hook
register_activation_hook(__FILE__, 'hubspot_styler_activate');
function hubspot_styler_activate() {
    // Add any activation tasks here
}