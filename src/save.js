import classnames from 'classnames';
import { useBlockProps, InnerBlocks, __experimentalGetColorClassesAndStyles as getColorClassesAndStyles } from '@wordpress/block-editor';

export default function save({attributes}) {

	const blockProps = useBlockProps.save(
		{ className: classnames('jc-simple-blurb', getColorClassesAndStyles( attributes ).className) },
		{ style: getColorClassesAndStyles( attributes ).style }
	);

    return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}