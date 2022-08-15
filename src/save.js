import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({attributes}) {
	const {title, content} = attributes;
	return (
		<div {...useBlockProps.save()}>
			<RichText.Content tagName="h4" value={title} />
			<RichText.Content tagName="p" value={content} />
		</div>
	);
}
