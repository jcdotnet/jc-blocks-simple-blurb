import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';

registerBlockType('jc-blocks/blurb-content', {
    title: 'Blurb Content',
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
		}
    },
	edit: Edit,
	save: Save,
});