<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Shoehorn theme with the underlying Bootstrap theme.
 *
 * @package    theme
 * @subpackage majhub
 * @copyright  &copy; 2016-onwards JHunt in respect to modifications of the Bootstrap theme.
 * @author     G J Barnard - gjbarnard at gmail dot com and {@link http://moodle.org/user/profile.php?id=442195}
 * @author     Based on code originally written by Bas Brands, David Scotson, G J Barnard and many other contributors.
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die;

// Settings.
$settings = null;

$ADMIN->add('themes', new admin_category('theme_majhub', 'majhub'));

$leaderboardsettings = new admin_settingpage('theme_majhub_leaderboards', get_string('leaderboards', 'theme_majhub'));



// The leaderboardcount.
$name = 'theme_majhub/leaderboardcount';
$title = get_string('leaderboardcount', 'theme_majhub');
$description = get_string('leaderboardcount_desc', 'theme_majhub');
$default=3;
$leaderboardcount = Array();
for($x=0;$x<11;$x++){$leaderboardcount[$x]=$x;}

$setting = new admin_setting_configselect($name, $title, $description, $default, $leaderboardcount);

$setting->set_updatedcallback('theme_reset_all_caches');
$leaderboardsettings->add($setting);

$ADMIN->add('theme_majhub', $leaderboardsettings);
