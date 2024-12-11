<?php

/**
 * Fired during plugin activation
 *
 * @link       https://favoredapp.co
 * @since      1.0.0
 *
 * @package    Favored
 * @subpackage Favored/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Favored
 * @subpackage Favored/includes
 * @author     Favored <info@favoredapp.co>
 */
class Favored_Activator
{
  function Favored_Activator()
  {
    register_activation_hook(__FILE__, array(&$this, 'activate'));
  }

  /**
   * Short Description. (use period)
   *
   * Long Description.
   *
   * @since    1.0.0
   */
  public static function activate()
  {
    // check if no account-login page, then create it
    if (!get_page_by_path('account-login')) {
      error_log(print_r('NO login page ', true));
      // Create login page object
      $login_page = array(
        'post_title'    => wp_strip_all_tags('Account Login'),
        'post_content'  => '<!-- wp:fav/login /-->',
        'post_status'   => 'publish',
        'post_author'   => 1,
        'post_type'     => 'page',
      );

      // Insert the post into the database
      $post_id = wp_insert_post($login_page);
      error_log(print_r('created login page id' . $post_id, true));
    } else {
      error_log(print_r('has login page ', true));
    }

    // check if no account-register page, then create it
    if (!get_page_by_path('account-register')) {
      error_log(print_r('NO register page ', true));
      // Create register page object
      $register_page = array(
        'post_title'    => wp_strip_all_tags('Account Register'),
        'post_content'  => '<!-- wp:fav/register /-->',
        'post_status'   => 'publish',
        'post_author'   => 1,
        'post_type'     => 'page',
      );

      // Insert the post into the database
      $post_id = wp_insert_post($register_page);
      error_log(print_r('created register page id' . $post_id, true));
    } else {
      error_log(print_r('has register page ', true));
    }
  }
}
