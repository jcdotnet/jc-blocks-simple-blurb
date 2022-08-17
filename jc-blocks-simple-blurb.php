<?php
/**
 * Plugin Name:       Simple Blurb for Gutenberg
 * Description:       Gutenberg block that displays an image and a short piece of information (title and text).
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            JC
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       jc-simple-blurb
 *
 * @package           jc-blocks
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function jc_blocks_simple_blurb_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'jc_blocks_simple_blurb_block_init' );