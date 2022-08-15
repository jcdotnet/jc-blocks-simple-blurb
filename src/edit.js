import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit({attributes, setAttributes}) {
	const {title, content} = attributes;
	const onTitleChange = (newTitle) => {
		setAttributes({title: newTitle});
	}
	const onContentChange = (newContent) => {
		setAttributes({content: newContent});
	}
	return (
		<div {...useBlockProps()}>
			<RichText placeholder={__('Blurb Title', 'jc-simple-blurb')} tagName="h4" onChange={onTitleChange} value={title}></RichText>
			<RichText placeholder={__('Blurb Content', 'jc-simple-blurb')} tagName="p" onChange={onContentChange} value={content}></RichText>
		</div>
	);
}
