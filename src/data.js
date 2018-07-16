
export default {
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
        'width': {}
    },
    customColors: {
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
              operand: 'Completed',
              value: '#98fb98'
            },
            {
              operator: '==',
              operand: 'In Progress',
              value: '#FFFF66'
            },
            {
              operator: '==',
              operand: 'Late',
              value: '#ff6a6a'
            }
          ]
        }] 
    
}
