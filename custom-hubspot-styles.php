<?php
/**
 * Plugin Name: HubSpot Form Styler
 * Plugin URI: https://github.com/lukasz-matysiewicz/custom-hubspot-styles
 * Description: Advanced styling for HubSpot forms with free marketing module
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Version: 1.1.0
 * Author: Matysiewicz Studio
 * Author URI: https://matysiewicz.studio
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: hubspot-form-styler
 * Domain Path: /languages
 *
 * @package HubSpotFormStyler
 * @author Matysiewicz Studio
 * @copyright Copyright (c) 2024, Matysiewicz Studio
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

/**
 * Current plugin version and constants
 */
define('HFS_VERSION', '1.1.0');
define('HFS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('HFS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('HFS_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Include required files
 */
require_once HFS_PLUGIN_DIR . 'admin/settings-page.php';

/**
 * The code that runs during plugin activation.
 */
function activate_hubspot_form_styler() {
    // Add activation tasks here
    $default_options = array(
        'button_color' => '#007ddf',
        'font_family' => 'Eurostile, Inter, arial, helvetica, sans-serif',
        'text_size' => '12px'
    );
    add_option('hfs_options', $default_options);
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_hubspot_form_styler() {
    // Add cleanup tasks here if needed
}

register_activation_hook(__FILE__, 'activate_hubspot_form_styler');
register_deactivation_hook(__FILE__, 'deactivate_hubspot_form_styler');

/**
 * Add settings link to plugins page
 */
function hfs_add_settings_link($links) {
    $settings_link = sprintf(
        '<a href="%s">%s</a>',
        admin_url('options-general.php?page=hubspot-form-styler'),
        __('Settings', 'hubspot-form-styler')
    );
    array_unshift($links, $settings_link);
    return $links;
}
add_filter('plugin_action_links_' . HFS_PLUGIN_BASENAME, 'hfs_add_settings_link');

/**
 * Add settings page
 */
function hfs_add_settings_page() {
    add_options_page(
        'HubSpot Form Styler Settings',
        'HubSpot Styler',
        'manage_options',
        'hubspot-form-styler',
        'hfs_render_settings_page'
    );
}
add_action('admin_menu', 'hfs_add_settings_page');

/**
 * Enqueue scripts and styles
 */
function hfs_enqueue_scripts() {
    // Get options
    $options = get_option('hfs_options', array());
    
    // Enqueue main script
    wp_enqueue_script(
        'hubspot-styler',
        HFS_PLUGIN_URL . 'assets/js/hubspot-styler.js',
        array(),
        HFS_VERSION,
        true
    );

    // Pass options to JavaScript
    wp_localize_script(
        'hubspot-styler',
        'hfsOptions',
        array(
            'buttonColor' => $options['button_color'] ?? '#007ddf',
            'fontFamily' => $options['font_family'] ?? 'Eurostile, Inter, arial, helvetica, sans-serif',
            'textSize' => $options['text_size'] ?? '12px'
        )
    );
}
add_action('wp_enqueue_scripts', 'hfs_enqueue_scripts');