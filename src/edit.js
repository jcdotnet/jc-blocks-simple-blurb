/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks, __experimentalUseColorProps as useColorProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';

 export default function Edit({ attributes }) {

	const TEMPLATE = [
		[ 'jc-blocks/blurb-content' ],
	];
	const blockProps = useBlockProps(
		{ className: useColorProps( attributes ).className }
	);

	return (	
		<div {...blockProps}>
			<InnerBlocks allowedBLocks={[ 'jc-blocks/blurb-content' ]} templateLock="all" template={TEMPLATE} />
		</div>
	);
}
