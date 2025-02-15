import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';

import styles from './ArticleParamsForm.module.scss';
import { useState, useRef, FormEvent, useEffect, useCallback } from 'react';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	contentWidthArr,
	backgroundColors,
	defaultArticleState,
	ArticleStateType,
	OptionType,
} from 'src/constants/articleProps';

interface IArticleParamsFormProps {
	setArticleState: (param: ArticleStateType) => void;
}

export const ArticleParamsForm = ({
	setArticleState,
}: IArticleParamsFormProps) => {
	const [isOpen, setIsMenuOpen] = useState<boolean>(false);
	const [formState, setFormState] = useState({
		fontFamily: defaultArticleState.fontFamilyOption,
		fontSize: defaultArticleState.fontSizeOption,
		fontColor: defaultArticleState.fontColor,
		backgroundColor: defaultArticleState.backgroundColor,
		contentWidth: defaultArticleState.contentWidth,
	});

	const menuRef = useRef<HTMLFormElement | null>(null);

	const toggleOpenForm = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const reloadState = useCallback(() => {
		setFormState({
			fontFamily: defaultArticleState.fontFamilyOption,
			fontSize: defaultArticleState.fontSizeOption,
			fontColor: defaultArticleState.fontColor,
			backgroundColor: defaultArticleState.backgroundColor,
			contentWidth: defaultArticleState.contentWidth,
		});
		setArticleState(defaultArticleState);
	}, [setArticleState]);

	const handleChange = useCallback(
		(field: keyof typeof formState) => (selectOption: OptionType) => {
			setFormState((prevState) => ({
				...prevState,
				[field]: selectOption,
			}));
		},
		[]
	);

	const formSubmitHandler = (evt: FormEvent) => {
		evt.preventDefault();
		setArticleState({
			fontFamilyOption: formState.fontFamily,
			fontSizeOption: formState.fontSize,
			fontColor: formState.fontColor,
			backgroundColor: formState.backgroundColor,
			contentWidth: formState.contentWidth,
		});
		setIsMenuOpen(false);
	};

	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, []);

	return (
		<>
			<ArrowButton onClick={() => toggleOpenForm()} isOpen={isOpen} />
			<aside
				className={clsx(styles.container, isOpen && styles.container_open)}
				ref={menuRef}>
				<form
					className={styles.form}
					onSubmit={formSubmitHandler}
					onReset={reloadState}>
					<Text as={'h2'} size={31} weight={800} uppercase={true}>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						selected={formState.fontFamily}
						options={fontFamilyOptions}
						onChange={handleChange('fontFamily')}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='Размер шрифта'
						selected={formState.fontSize}
						options={fontSizeOptions}
						onChange={handleChange('fontSize')}
					/>
					<Select
						title='Цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={handleChange('fontColor')}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={handleChange('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={handleChange('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
