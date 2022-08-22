import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import icon from './icon';

registerBlockType('jc-blocks/blurb-content', {
    title: 'Blurb Content',
	description: __('Add the blurb image, title and description', 'jc-simple-blurb'),
    parent: [ 'jc-blocks/simple-blurb' ],
	attributes: {
        imageId: {
			type: 'number',
		},
        imageUrl: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src'
		},
        alt: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'alt',
			default: ''
		},
        href: {
			type: 'string',
			source: 'attribute',
			selector: 'jc-blurb-image>a',
			attribute: 'alt',
			default: ''
		},
        imageAlign: {
			type: 'string',
			default: 'center'
		},
        imageHasEffect: {
            type: 'bool',
            default: false
        },
        maxWidth: {
            type: 'string',
        },
        allowBlocks: {
            type: 'boolean',
            default: false
        }

    },
    supports: {
        reusable: false,
        html: false,
        align: true,
		color: {
			__experimentalSkipSerialization: true,
			gradients: true,
			__experimentalDefaultControls: {
				background: true,
				text: true
			}
		},
		spacing: {
			padding: true,
			margin: true
		}
    },
	edit: Edit,
	save: Save,
	icon
});