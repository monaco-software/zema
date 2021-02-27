import React, { FC } from 'react';
import { Box, Footer, Grommet, Heading } from 'grommet';
import b_ from 'b_';
import { useAuth } from '../../hooks';

import './landing.css';
import { Css3, Docker, Github, Grommet as GrommetIcon, Html5, Reactjs } from 'grommet-icons';

const block = b_.lock('landing');

export const Landing: FC = () => {
  useAuth(false);
  return (
    <Grommet full={true} className={block()}>
      <Box fill align="center">
        <Box width="700px" className={block('container')}>
          <Box pad={{ top: '50px' }}>
            <Heading textAlign="center" level="2">
              Лягушка
            </Heading>
          </Box>
          <Box
            flex className={block('paper')}
            justify="center"
            style={{ fontSize: `${document.body.clientHeight / 50}px`,
              lineHeight: `${document.body.clientHeight / 45 }px`,
            }}
          >
            Что может быть драматичнее извечного противостояния
            маленькой зеленой лягушки грозному и загадочному ацтекскому богу?
            Чтобы победить, требуется не пропустить длинную цепочку из разноцветных
            шариков, генерируемую враждебным божеством, к золотому черепу. Для этого пригодится умение лягушки
            стрелять разноцветными шариками. Ведь если после выстрела и попадания шарика в цепочку образуется группа из
            не менее чем трех шариков одного цвета, то она полностью исчезает. Более того, если слева и справа от
            уничтоженных шаров будут располагаться шарики одного цвета, то они соединяются и если их опять окажется
            не менее трех, то они снова исчезнут (получается так называемый комбо-прием).<br /><br />
            Вы – тот, кто должен помочь лягушке в ее нелегкой борьбе.
          </Box>
          <Heading textAlign="center">
            v s
          </Heading>
          <Box
            flex
            justify="center"
            className={block('paper')}
            style={{ fontSize: `${document.body.clientHeight / 50}px`,
              lineHeight: `${document.body.clientHeight / 45 }px`,
            }}
          >
            Игра, принёсшая студии «PopCap» мировую известность, открывшая собой совершенно новый геймплей, и в
            одночасье ставшая безумно популярной. Совершенно естественно, что сразу за ней вышло много клонов, да и
            теперь клоны выходят с завидным постоянством. Все они получают прозвище «Zuma»-образных.

            Но, на самом деле, «Zuma» сама является клоном, а настоящим прародителем жанра была безызвестная игра под
            названием «PuzzLoop». Она вышла в далёком 1998 году, но не получила широкого распространения, потому что
            поиграть в неё можно было лишь на игровой приставке PlayStation 1. «Zuma Deluxe», выпущенная для
            персональных компьютеров, вывела идею этой игры в широкие массы.

          </Box>
          <Heading textAlign="center" level="2">
            Божество
          </Heading>
          <Footer
            flex={false}
            pad="medium"
            gap="large"
            justify="center"
            direction="row"
          >
            <div title="HTML5">
              <Html5 size="medium" color="#FFF" />
            </div>
            <Github size="medium" color="#FFF" />
            <Reactjs size="medium" color="#FFF" />
            <GrommetIcon size="medium" color="#FFF" />
            <Docker size="medium" color="brand" />
            <Css3 size="medium" color="brand" />
          </Footer>
        </Box>
      </Box>
    </Grommet>
  );
};

