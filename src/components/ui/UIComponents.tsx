import React from 'react';
import ZoneIconDark from "../../assets/icons/zone.svg?react";
import PuzzleIconClosed from "../../assets/icons/noun-locker-6097531.svg?react";
import TornPaper from "../../assets/icons/noun-torn-paper-3017230.svg?react";
import Diary from "../../assets/icons/noun-diary-6966311.svg?react";

// ExampleGameProps Component
interface ExampleGameProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const ExampleGame: React.FC<ExampleGameProps> = ({
                                                size = 'medium',
                                                className = ''
                                              }) => {
  const sizes = {
    small: 'text-sm px-2 py-1',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-6 py-3'
  };

  return (
      <div className={`game-example howtoplay  ${sizes[size]} ${className}`}>

        <div>

          <div className="game-container background-light center">
            <div style={{textAlign: "center", fontWeight: "bold", fontSize: "1.2em"}}>Mission: <span className="mission" data-wp-text="context.mission">To Win Game</span></div>
            <div className="button-bar"><button className="button background-light ">Zone Map</button><button className="button background-light ">Switch to Dark</button><button className="button background-light ">Help</button><button className="button background-light ">Quit</button></div>
            <div className="puzzle-solved" >Puzzles Solved? <span>0</span>/<span>2</span></div>
            <div aria-label="Time" className="time time-change"><div className="small">time started: 02/12/26 6:19PM | hint time: 0</div></div>
            <div className="top-bar top-bar-change">
              <h4>Select Zone:</h4>
              <div className="game-item-holder">
                <div aria-label="f1171096-368f-409a-b204-3110423ffa94" className="zone-border zone-icon-container"><ZoneIconDark height={30} width={30}/>
                  <div className="zone-text">zone 1</div></div>
                <div aria-label="492918a3-379d-4922-b6be-73d0e0354185" className="zone-icon-container"><ZoneIconDark height={30} width={30}/>
                  <div className="zone-text">zone 2</div></div>
              </div>
            </div>
            <div className="zone-name center">Zone 1 for test game</div>
            <div className="play-area">
              <div aria-label="zone_f1171096-368f-409a-b204-3110423ffa94" className="show">
                <div className="zone-name center">description: <br />The center of this zone is the main sign for the park</div>
                <div className={"center"}>
                  <img src="https://escapeout.games/wp-content/uploads/2025/02/jaycee-park-sign-zone-image-10-150x150.jpg" />
                </div>
              </div>

              <h4 className={"center"}>Select Puzzle:</h4>
              <div className="game-item-holder">
                <div className="show game-item puzzle-not-solved">
                  <PuzzleIconClosed className={"light-background "} height={50} width={50}/>
                </div>
              </div>

              <h4 className={"center"}>Select Clue:</h4>
              <div className="game-item-holder">
                <div aria-label="Clue 1" className="game-item clue0">
                  <Diary
                      className={"light-background "} height={70} width={70}/>
                </div>
                <div aria-label="Clue 2" className="game-item clue0"><TornPaper
                    className={"light-background "} height={70} width={70}/></div>
              </div>
              <h4 className={"center"}>Select Hint:</h4>
              <div className="game-item-holder">
                <div aria-label="test hint" className="game-item hint1">
                  <div>test hint</div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
  );
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  className = ''
}) => {
  const baseStyles = 'px-4 py-2 rounded font-medium transition-colors';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };
  const sizes = {
    small: 'text-sm px-2 py-1',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-6 py-3'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// H1 Component
interface H1Props {
  children: React.ReactNode;
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'xl';
  className?: string;
}

export const H1: React.FC<H1Props> = ({ 
  children, 
  color = 'text-gray-900', 
  size = 'large',
  className = ''
}) => {
  const sizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <h1 className={`font-bold ${sizes[size]} ${color} ${className}`}>
      {children}
    </h1>
  );
};
// View Component
interface ViewProps {
  children: React.ReactNode;
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'xl';
  className?: string;
}
export const View: React.FC<ViewProps> = ({
                                        children,
                                        color = 'text-gray-900',
                                        size = 'large',
                                        className = ''
                                      }) => {
  const sizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
      <div className={`font-bold ${sizes[size]} ${color} ${className}`}>
        {children}
      </div>
  );
};

// Flex Component
interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: 'none' | 'small' | 'medium' | 'large';
  wrap?: boolean;
  className?: string;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 'none',
  wrap = false,
  className = ''
}) => {
  const directions = {
    row: 'flex-row',
    column: 'flex-col'
  };
  const justifyContent = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };
  const alignItems = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };
  const gaps = {
    none: '',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6'
  };

  return (
    <div className={`flex ${directions[direction]} ${justifyContent[justify]} ${alignItems[align]} ${gaps[gap]} ${wrap ? 'flex-wrap' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Example Usage Component
export const ExampleUsage: React.FC = () => {
  return (
    <Flex direction="column" gap="medium" className="p-4">
      <H1 size="xl" color="text-blue-600">Welcome to My App</H1>
      
      <Flex justify="between" align="center" gap="small">
        <Button variant="primary" onClick={() => console.log('Primary clicked')}>
          Primary Action
        </Button>
        <Button variant="secondary" size="small">
          Secondary
        </Button>
        <Button variant="danger" disabled>
          Disabled
        </Button>
      </Flex>
      
      <Flex direction="column" gap="small">
        <H1 size="medium">Section Title</H1>
        <p>Some content here...</p>
      </Flex>
    </Flex>
  );
};