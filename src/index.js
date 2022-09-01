import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

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
	example: {
		innerBlocks: [
			{
				name: 'jc-blocks/blurb-content',
				attributes: {
					mediaType: 'image',
					imageUrl: 'https://josecarlosroman.com/wp-content/uploads/2022/09/simple-blurb-image.jpg',
					maxWidth: '50%',
					width: 50, // 
				},
				innerBlocks: [
					{
						name: 'core/heading',
						attributes: {
							content: 'Simple Blurb.',
						},
					},
					{
						name: 'core/paragraph',
						attributes: {
							content: __('This is a dummy description for the simple blurb. You can add and style this content from the inner block toolbar and sidebar.', 'jc-simple-blurb')
						},
					},
				]
			},
		],
	},
	edit: Edit,
	save,
});
