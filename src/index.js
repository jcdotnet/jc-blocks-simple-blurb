import { registerBlockType } from '@wordpress/blocks';
import { mediaAndText as icon } from '@wordpress/icons';
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';

registerBlockType('jc-blocks/jc-simple-blurb', {
	icon,
	edit: Edit,
	save,
});
