
export default {
    Attributes: {
        'href': {
            'placeholder': 'URL'
        },
        'target': {
            'options': '_blank,_self,_parent,_top'
        }
        ,
        'class': {
            'options': 'sp-field-customFormatBackground,sp-field-severity--good,sp-field-severity--low,sp-field-severity--warning,sp-field-severity--blocked,sp-field-dataBars,sp-field-trending--up,sp-field-trending--down,sp-field-quickAction'
        }
    },
    CSSProperties: {
        'background-color': {
            'placeholder': '#hex -- color'
        },
        'font-size': {
            'placeholder': '18px -- 150% '
        },
        'text-align': {
            'options': 'left,right,center,justify'
        },
        'border': {
            'placeholder': '4px solid black'
        },
        'border-radius': {},
        'font-weight': {
            'options': 'bold,semibold'
        },
        
        'color': {
            'placeholder': '#hex -- color'
        },
        'width': {},
        'max-height': {},
        'overflow': {
            'options': 'scroll,hidden,auto,visible'
        }
    },
    customColors: {
        'Transparent': 'transparent',
        'Green': '#98FB98',
        'Yellow': '#FFFF66',
        'Orange': '#FFA450',
        'Red': '#FF6A6A',
        'Blue': '#5078FF',
        'Purple': '#B350FF',
        'Custom': '#'
    },
    template_completedInProgressLate: [
        {
          property: 'background-color',
          value:  [
            {
              operator: '==',
              operand: '@currentField',
              operand2: 'Completed',
              value: '#98fb98'
            },
            {
              operator: '==',
              operand: '@currentField',
              operand2: 'In Progress',
              value: '#FFFF66'
            },
            {
              operator: '==',
              operand: '@currentField',
              operand2: 'Late',
              value: '#ff6a6a'
            }
          ]
        }],
        template_dataBars: {
            attributes: [
                {
                    attribute: 'class',
                    value: 'sp-field-dataBars'
                }
            ],
            properties: [
                {
                    property: 'width',
                    value: '@currentField++%'
                }
            ]
        } 
    
}
