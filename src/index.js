import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './blurb-content';
import icon from './blurb-content/icon'
import Edit from './edit';
import save from './save';
import './style.scss';

registerBlockType('jc-blocks/simple-blurb', {
	icon,
	edit: Edit,
	save,
});
