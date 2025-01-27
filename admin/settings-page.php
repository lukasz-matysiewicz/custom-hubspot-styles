<?php
/**
 * HubSpot Form Styler Settings Page
 *
 * @package HubSpotFormStyler
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

/**
 * Register settings
 */
function hfs_register_settings() {
    register_setting(
        'hfs_options_group',
        'hfs_options',
        'hfs_sanitize_options'
    );

    add_settings_section(
        'hfs_general_section', 
        'Form Style Settings', 
        'hfs_section_callback', 
        'hubspot-form-styler'
    );

    // Button Color
    add_settings_field(
        'button_color',
        'Button Color',
        'hfs_color_field_callback',
        'hubspot-form-styler',
        'hfs_general_section',
        array(
            'id' => 'button_color',
            'label' => 'Choose the button background color'
        )
    );

    // Font Family
    add_settings_field(
        'font_family',
        'Font Family',
        'hfs_font_family_callback',
        'hubspot-form-styler',
        'hfs_general_section',
        array(
            'id' => 'font_family',
            'label' => 'Select the font family for forms'
        )
    );

    // Text Size
    add_settings_field(
        'text_size',
        'Text Size',
        'hfs_text_size_callback',
        'hubspot-form-styler',
        'hfs_general_section',
        array(
            'id' => 'text_size',
            'label' => 'Select the base text size'
        )
    );
}
add_action('admin_init', 'hfs_register_settings');

/**
 * Sanitize options before saving
 */
function hfs_sanitize_options($input) {
    $sanitized_input = array();
    
    if (isset($input['button_color'])) {
        $sanitized_input['button_color'] = sanitize_hex_color($input['button_color']);
    }

    if (isset($input['font_family'])) {
        $sanitized_input['font_family'] = sanitize_text_field($input['font_family']);
    }

    if (isset($input['text_size'])) {
        $sanitized_input['text_size'] = sanitize_text_field($input['text_size']);
    }

    return $sanitized_input;
}

/**
 * Section callback - Description of settings section
 */
function hfs_section_callback() {
    echo '<p>Customize the appearance of your HubSpot forms. Changes will apply to all forms on your site.</p>';
}

/**
 * Color field callback
 */
function hfs_color_field_callback($args) {
    $options = get_option('hfs_options', array());
    $value = isset($options[$args['id']]) ? $options[$args['id']] : '#007ddf';
    ?>
    <input type="color" 
           id="hfs_<?php echo esc_attr($args['id']); ?>" 
           name="hfs_options[<?php echo esc_attr($args['id']); ?>]" 
           value="<?php echo esc_attr($value); ?>"
           class="hfs-color-picker">
    <p class="description"><?php echo esc_html($args['label']); ?></p>
    <?php
}

/**
 * Font family field callback
 */
function hfs_font_family_callback($args) {
    $options = get_option('hfs_options', array());
    $value = isset($options[$args['id']]) ? $options[$args['id']] : 'Eurostile, Inter, arial, helvetica, sans-serif';
    $font_families = array(
        'Eurostile, Inter, arial, helvetica, sans-serif' => 'Eurostile & Inter',
        'Inter, arial, helvetica, sans-serif' => 'Inter',
        'arial, helvetica, sans-serif' => 'Arial',
        'Georgia, serif' => 'Georgia',
        'system-ui, -apple-system, sans-serif' => 'System Font'
    );
    ?>
    <select id="hfs_<?php echo esc_attr($args['id']); ?>" 
            name="hfs_options[<?php echo esc_attr($args['id']); ?>]">
        <?php foreach ($font_families as $font_value => $font_label) : ?>
            <option value="<?php echo esc_attr($font_value); ?>" 
                    <?php selected($value, $font_value); ?>>
                <?php echo esc_html($font_label); ?>
            </option>
        <?php endforeach; ?>
    </select>
    <p class="description"><?php echo esc_html($args['label']); ?></p>
    <?php
}

/**
 * Text size field callback
 */
function hfs_text_size_callback($args) {
    $options = get_option('hfs_options', array());
    $value = isset($options[$args['id']]) ? $options[$args['id']] : '12px';
    $sizes = array('10px', '12px', '14px', '16px', '18px');
    ?>
    <select id="hfs_<?php echo esc_attr($args['id']); ?>" 
            name="hfs_options[<?php echo esc_attr($args['id']); ?>]">
        <?php foreach ($sizes as $size) : ?>
            <option value="<?php echo esc_attr($size); ?>" 
                    <?php selected($value, $size); ?>>
                <?php echo esc_html($size); ?>
            </option>
        <?php endforeach; ?>
    </select>
    <p class="description"><?php echo esc_html($args['label']); ?></p>
    <?php
}

/**
 * Render the settings page
 */
function hfs_render_settings_page() {
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // Show success message if settings were updated
    if (isset($_GET['settings-updated'])) {
        add_settings_error(
            'hfs_messages',
            'hfs_message',
            'Settings Saved',
            'updated'
        );
    }
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <?php settings_errors('hfs_messages'); ?>

        <form action="options.php" method="post">
            <?php
            settings_fields('hfs_options_group');
            do_settings_sections('hubspot-form-styler');
            submit_button('Save Settings');
            ?>
        </form>
    </div>

    <style>
        .hfs-color-picker {
            width: 100px;
            height: 30px;
            padding: 0;
            margin: 0;
        }
    </style>
    <?php
}