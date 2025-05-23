import { Color, Number, Select, Style } from '@makeswift/runtime/controls'

export const props = {
	className: Style({
		properties: [Style.Margin, Style.Width, Style.TextStyle]
	}),
	color: Color({ label: 'Color', defaultValue: '#121118' }),
	as: Select({
		label: 'Block tag',
		options: [
			{ value: 'p', label: '<p>' },
			{ value: 'h1', label: '<h1>' },
			{ value: 'h2', label: '<h2>' },
			{ value: 'h3', label: '<h3>' },
			{ value: 'h4', label: '<h4>' },
			{ value: 'h5', label: '<h5>' },
			{ value: 'h6', label: '<h6>' }
		],
		defaultValue: 'p'
	}),
	alignment: Select({
		label: 'Alignment',
		options: [
			{ value: 'left', label: 'Left' },
			{ value: 'center', label: 'Center' },
			{ value: 'right', label: 'Right' },
			{ value: 'justify', label: 'Justify' }
		]
	}),
	lineHeight: Number({
		label: 'Line height',
		min: 0,
		max: 2,
		step: 0.1
	})
}
